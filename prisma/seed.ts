import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

    await prisma.user.create({
       data: {
           phone: '+5511999999999',
           name: 'User Fake'
       }
    })

    await prisma.product.create({
        data: {
            name: 'PS5',
            description: 'PS5 Playstation 5 Sony Slim, SSD 1TB, Controle sem fio DualSense Com Mídia Física, Branco + Jogos Returnal e Ratchet & Clank',
            price: 100,
            inventory: {
                create: {
                    quantity: 20
                }
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'Controle Sony DualSense PS5',
            description: 'Sinta fisicamente o feedback responsivo em suas ações do jogo com atuadores duplos, que substituem os barulhentos motores tradicionais',
            price: 20,
            inventory: {
                create: {
                    quantity: 50
                }
            }
        }
    })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })