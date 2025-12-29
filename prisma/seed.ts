import { seedContent } from "./seeds/content.seed";
import { seedAlbums } from "./seeds/albums.seed";
import { seedServices } from "./seeds/services.seed";
import { seedContacts } from "./seeds/contacts.seed";
import { seedAboutUs } from "./seeds/aboutus.seed";
import { seedSpecialization } from "./seeds/specialization.seed";

async function main() {
  await seedContent();
  await seedAlbums();
  await seedServices();
  await seedContacts();
  await seedAboutUs();
  await seedSpecialization();
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Prisma seeds completed");
    process.exit(0);
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
