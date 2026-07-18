const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  await prisma.product.createMany({
    data: [
      {
        name: "Support casque gaming 3D",
        description: "Support personnalisé imprimé en PLA",
        price: 24.90,
        image: "/products/casque.jpg",
        stock: 10
      },
      {
        name: "Figurine personnalisée",
        description: "Figurine imprimée en résine haute précision",
        price: 39.90,
        image: "/products/figurine.jpg",
        stock: 5
      },
      {
        name: "Pièce mécanique sur mesure",
        description: "Conception et impression 3D professionnelle",
        price: 59.90,
        image: "/products/mecanique.jpg",
        stock: 3
      }
    ]
  });

  console.log("Produits ajoutés !");
}


main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());