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

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await database.$disconnect()
    })
