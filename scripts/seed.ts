const { PrismaClient } = require('@prisma/client')
require('dotenv').config()  // Add this line to load environment variables

const database = new PrismaClient();

async function main() {
    // Define roles and job titles
    const roles = ['Instructor', 'Officer', 'Supervisor', 'Engineer', 'Admin']
    const jobTitles = ['Instructor', 'Officer', 'Supervisor', 'Engineer']

    // Create roles
    const roleData = roles.map(role => ({
        name: role,
    }))

    // Create job titles
    const jobTitleData = jobTitles.map(title => ({
        title: title,
    }))

    // Insert roles
    const createdRoles = await database.role.createMany({
        data: roleData,
        skipDuplicates: true,
    })

    // Insert job titles
    const createdJobTitles = await database.jobTitle.createMany({
        data: jobTitleData,
        skipDuplicates: true,
    })

    console.log(`${createdRoles.count} roles created`)
    console.log(`${createdJobTitles.count} job titles created`)
}

async function clearDataBase() {
    // Disable foreign key checks
    await database.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;

    // Get all table names
    const tables = await database.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE();
  `;

    // Delete data from all tables
    for (const { table_name } of tables) {
        try {
            await database.$executeRawUnsafe(`DELETE FROM \`${table_name}\``);
        } catch (error) {
            console.error(`Error deleting data from table ${table_name}:`, error);
        }
    }

    // Re-enable foreign key checks
    await database.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
}

clearDataBase()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await database.$disconnect();
        main()
            .catch(e => {
                console.error(e)
                process.exit(1)
            })
            .finally(async () => {
                await database.$disconnect()
            })

    });

