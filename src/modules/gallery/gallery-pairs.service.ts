import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class GalleryPairsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Автоматично створює пари "До/Після" коли є 3+3 фото
   */
  async createPairsAutomatically(albumId: number): Promise<void> {
    // Отримати всі фото з альбому
    const photos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
      orderBy: { createdAt: "asc" },
    });

    // Розділити на "До" та "Після" за мітками
    const beforePhotos = photos.filter((photo) => photo.tag === "before");

    const afterPhotos = photos.filter((photo) => photo.tag === "after");

    console.log(
      `Found ${beforePhotos.length} "До" photos and ${afterPhotos.length} "Після" photos`
    );

    // Перевірити чи є мінімум 3 фото кожного типу
    if (beforePhotos.length < 3 || afterPhotos.length < 3) {
      console.log("Not enough photos to create pairs (need 3+3)");
      return;
    }

    // НЕ видаляти існуючі пари - додавати нові
    // await this.prisma.beforeAfterPair.deleteMany({
    //   where: { albumId },
    // });

    // Отримати існуючі пари, щоб не створювати дублікати
    const existingPairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      select: { beforePhotoId: true, afterPhotoId: true, collectionId: true },
    });

    // Визначити які фото вже використовуються в парах
    const usedBeforePhotoIds = new Set<number>();
    const usedAfterPhotoIds = new Set<number>();
    const existingCollectionIds = new Set<number>();
    existingPairs.forEach((pair) => {
      usedBeforePhotoIds.add(pair.beforePhotoId);
      usedAfterPhotoIds.add(pair.afterPhotoId);
      if (pair.collectionId) {
        existingCollectionIds.add(pair.collectionId);
      }
    });

    // Визначити початковий collectionId для нових колекцій (максимальний існуючий + 1)
    const maxExistingCollectionId =
      existingCollectionIds.size > 0
        ? Math.max(...Array.from(existingCollectionIds))
        : 0;
    const startCollectionId = maxExistingCollectionId + 1;

    // Фільтрувати фото - використовувати тільки ті, що НЕ використовуються в парах
    const availableBeforePhotos = beforePhotos.filter(
      (photo) => !usedBeforePhotoIds.has(photo.id)
    );
    const availableAfterPhotos = afterPhotos.filter(
      (photo) => !usedAfterPhotoIds.has(photo.id)
    );

    console.log(
      `📊 Available photos: ${availableBeforePhotos.length} "До" and ${availableAfterPhotos.length} "Після" (excluding ${usedBeforePhotoIds.size} used before and ${usedAfterPhotoIds.size} used after)`
    );
    console.log(
      `📊 Used before photo IDs: [${Array.from(usedBeforePhotoIds)
        .slice(0, 10)
        .join(", ")}${usedBeforePhotoIds.size > 10 ? "..." : ""}]`
    );
    console.log(
      `📊 Used after photo IDs: [${Array.from(usedAfterPhotoIds)
        .slice(0, 10)
        .join(", ")}${usedAfterPhotoIds.size > 10 ? "..." : ""}]`
    );
    console.log(
      `📁 Existing collections: ${existingCollectionIds.size}, max collectionId: ${maxExistingCollectionId}, starting new collections from: ${startCollectionId}`
    );

    // Створити колекції по 3+3 фото з доступних (невикористаних) фото
    const collectionsToCreate = [];
    const maxCollections = Math.min(
      Math.floor(availableBeforePhotos.length / 3),
      Math.floor(availableAfterPhotos.length / 3)
    );

    for (let i = 0; i < maxCollections; i++) {
      const collectionId = startCollectionId + i;
      const startBefore = i * 3;
      const startAfter = i * 3;

      // Створити 3 пари для кожної колекції з доступних фото
      for (let j = 0; j < 3; j++) {
        const beforePhoto = availableBeforePhotos[startBefore + j];
        const afterPhoto = availableAfterPhotos[startAfter + j];

        if (beforePhoto && afterPhoto) {
          // Перевірити чи фото вже використовуються в будь-яких парах (незалежно від collectionId)
          const beforePhotoAlreadyUsed = usedBeforePhotoIds.has(beforePhoto.id);
          const afterPhotoAlreadyUsed = usedAfterPhotoIds.has(afterPhoto.id);

          if (!beforePhotoAlreadyUsed && !afterPhotoAlreadyUsed) {
            // Фото не використовуються - можна створити пару
            collectionsToCreate.push({
              albumId,
              beforePhotoId: beforePhoto.id,
              afterPhotoId: afterPhoto.id,
              label: `Колекція ${collectionId} - Пара ${j + 1}`,
              collectionId: collectionId,
            });

            // Відразу додати в множину використаних, щоб уникнути дублікатів в одній ітерації
            usedBeforePhotoIds.add(beforePhoto.id);
            usedAfterPhotoIds.add(afterPhoto.id);
          } else {
            console.log(
              `⚠️ Пропущено пару: beforePhoto ${beforePhoto.id} (used: ${beforePhotoAlreadyUsed}) або afterPhoto ${afterPhoto.id} (used: ${afterPhotoAlreadyUsed}) вже використовуються`
            );
          }
        }
      }
    }

    if (collectionsToCreate.length > 0) {
      await this.prisma.beforeAfterPair.createMany({
        data: collectionsToCreate,
      });

      console.log(
        `Created ${collectionsToCreate.length} pairs in ${maxCollections} new collection(s) (starting from collectionId ${startCollectionId}) automatically`
      );
    }
  }

  /**
   * Отримати пари з повною інформацією про фото
   */
  async getPairsWithPhotos(albumId: number) {
    const pairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      include: {
        beforePhoto: true,
        afterPhoto: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Трансформувати id в key для фронтенду
    return pairs.map((pair) => {
      const { id, ...rest } = pair;
      return { key: id, ...rest };
    });
  }

  /**
   * Отримати колекції (групи по 3 пари)
   */
  async getCollections(albumId: number) {
    const pairs = await this.getPairsWithPhotos(albumId);

    // Групувати пари за collectionId
    const collections = {};
    pairs.forEach((pair) => {
      const collectionId = pair.collectionId || 1;
      if (!collections[collectionId]) {
        collections[collectionId] = [];
      }
      collections[collectionId].push(pair);
    });

    // Конвертувати в масив колекцій
    return Object.keys(collections).map((collectionId) => ({
      key: parseInt(collectionId),
      pairs: collections[collectionId],
      count: collections[collectionId].length,
    }));
  }

  /**
   * Перевірити чи можна створити пари
   */
  async canCreatePairs(albumId: number): Promise<boolean> {
    const photos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
    });

    const beforeCount = photos.filter((photo) => photo.tag === "before").length;

    const afterCount = photos.filter((photo) => photo.tag === "after").length;

    return beforeCount >= 3 && afterCount >= 3;
  }

  /**
   * Видалити всю колекцію (3 пари "До і Після")
   */
  async deleteCollection(
    albumId: number,
    collectionId: number,
    deletePhotos: boolean = true
  ): Promise<{ deletedPairs: number; deletedPhotos: number }> {
    // Знайти всі пари цієї колекції
    const pairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId, collectionId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    if (pairs.length === 0) {
      return { deletedPairs: 0, deletedPhotos: 0 };
    }

    // Видалити пари
    await this.prisma.beforeAfterPair.deleteMany({
      where: { albumId, collectionId },
    });

    let deletedPhotos = 0;

    if (deletePhotos) {
      // Зібрати всі унікальні фото ID
      const photoIds = new Set<number>();
      pairs.forEach((pair) => {
        photoIds.add(pair.beforePhotoId);
        photoIds.add(pair.afterPhotoId);
      });

      // Перевірити чи фото використовуються в інших парах
      for (const photoId of photoIds) {
        const otherPairs = await this.prisma.beforeAfterPair.findMany({
          where: {
            OR: [{ beforePhotoId: photoId }, { afterPhotoId: photoId }],
          },
        });

        // Якщо фото не використовується в інших парах - видалити
        if (otherPairs.length === 0) {
          const photo = await this.prisma.galleryPhoto.findUnique({
            where: { id: photoId },
          });

          if (photo) {
            // Видалити з Cloudinary (якщо є publicId)
            if (photo.publicId) {
              try {
                // Тут потрібно буде додати UploadService для видалення з Cloudinary
                console.log(`Would delete from Cloudinary: ${photo.publicId}`);
              } catch (error) {
                console.error(
                  `Failed to delete from Cloudinary: ${photo.publicId}`,
                  error
                );
              }
            }

            // Видалити з БД
            await this.prisma.galleryPhoto.delete({
              where: { id: photoId },
            });

            deletedPhotos++;
          }
        }
      }
    }

    // Очистити сиротливі фото після видалення колекції
    await this.cleanupOrphanedPhotos(albumId);

    return { deletedPairs: pairs.length, deletedPhotos };
  }

  /**
   * Отримати пари конкретної колекції
   */
  async getPairsByCollection(albumId: number, collectionId: number) {
    return this.prisma.beforeAfterPair.findMany({
      where: { albumId, collectionId },
      include: {
        beforePhoto: true,
        afterPhoto: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Замінити фото "До" в парі
   */
  async replaceBeforePhoto(pairId: number, newPhotoId: number): Promise<any> {
    const pair = await this.prisma.beforeAfterPair.findUnique({
      where: { id: pairId },
      include: { beforePhoto: true },
    });

    if (!pair) {
      throw new Error("Pair not found");
    }

    // Оновити пару з новим фото
    const updatedPair = await this.prisma.beforeAfterPair.update({
      where: { id: pairId },
      data: { beforePhotoId: newPhotoId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    return updatedPair;
  }

  /**
   * Замінити фото "Після" в парі
   */
  async replaceAfterPhoto(pairId: number, newPhotoId: number): Promise<any> {
    const pair = await this.prisma.beforeAfterPair.findUnique({
      where: { id: pairId },
      include: { afterPhoto: true },
    });

    if (!pair) {
      throw new Error("Pair not found");
    }

    // Оновити пару з новим фото
    const updatedPair = await this.prisma.beforeAfterPair.update({
      where: { id: pairId },
      data: { afterPhotoId: newPhotoId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    return updatedPair;
  }

  /**
   * Очистити фото, які не входять в жодну пару (сиротливі фото)
   */
  async cleanupOrphanedPhotos(albumId: number): Promise<number> {
    // Отримати всі фото з альбому
    const allPhotos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
    });

    // Отримати всі пари альбому
    const allPairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      select: { beforePhotoId: true, afterPhotoId: true },
    });

    // Зібрати ID всіх фото, які використовуються в парах
    const usedPhotoIds = new Set<number>();
    allPairs.forEach((pair) => {
      usedPhotoIds.add(pair.beforePhotoId);
      usedPhotoIds.add(pair.afterPhotoId);
    });

    // Знайти фото, які не використовуються
    const orphanedPhotos = allPhotos.filter(
      (photo) => !usedPhotoIds.has(photo.id)
    );

    // Видалити сиротливі фото
    let deletedCount = 0;
    for (const photo of orphanedPhotos) {
      try {
        // Видалити з Cloudinary (якщо є publicId)
        if (photo.publicId) {
          try {
            await cloudinary.uploader.destroy(photo.publicId);
            console.log(`🗑️ Видалено з Cloudinary: ${photo.publicId}`);
          } catch (cloudinaryError) {
            console.error(
              `Помилка видалення з Cloudinary ${photo.publicId}:`,
              cloudinaryError
            );
          }
        }

        // Видалити з БД
        await this.prisma.galleryPhoto.delete({
          where: { id: photo.id },
        });

        deletedCount++;
        console.log(
          `✅ Видалено сиротливе фото (ID: ${photo.id}, tag: ${photo.tag})`
        );
      } catch (error) {
        console.error(`Помилка видалення фото ${photo.id}:`, error);
      }
    }

    if (deletedCount > 0) {
      console.log(
        `🧹 Очищено ${deletedCount} сиротливих фото з альбому ${albumId}`
      );
    }

    return deletedCount;
  }
}
