const { PrismaClient } = require('@prisma/client')


const database = new PrismaClient();

async function main() {
    try {
        await database.instrumentType.createMany({
            data: [
                { name: 'نوع 1' },
                { name: 'نوع 1' },
                { name: 'نوع 3' },
                { name: 'نوع 4' },
            ]
        })

        console.log('Successs');

    } catch (error) {
        console.log('Error seeding the Database categories', error);
    } finally {
        await database.$disconnect()
    }
}

main()