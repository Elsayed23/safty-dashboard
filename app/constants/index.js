export const instrumentsData = [
    {
        id: 1,
        name: 'جرافة',
        createdAt: '2024-06-01:05:58'
    },
    {
        id: 2,
        name: 'حفارة',
        createdAt: '2024-06-02:15:30'
    },
    {
        id: 3,
        name: 'رافعة',
        createdAt: '2024-06-03:25:45'
    },
    {
        id: 4,
        name: 'شاحنة',
        createdAt: '2024-06-04:35:12'
    },
    {
        id: 5,
        name: 'بلدوزر',
        createdAt: '2024-06-05:45:20'
    }
];

export const typeOfTestsData = [
    {
        id: 1,
        instrumentId: 2,
        name: "فحص حفارة 1",
        testEntries: [
            {
                testName: 'فحص حفارة 1', testCheckName: 'تشك 1'
            },
            {
                testName: 'فحص حفارة 1', testCheckName: 'تشك 2'
            }
        ]
    },
    {
        id: 2,
        instrumentId: 3,
        name: "فحص رافعة 1",
        testEntries: [
            {
                testName: 'فحص رافعة 1', testCheckName: 'تشك 1'
            },
            {
                testName: 'فحص رافعة 1', testCheckName: 'تشك 2'
            },
            {
                testName: 'فحص رافعة 1', testCheckName: 'تشك 3'
            }
        ]
    },
    {
        id: 3,
        instrumentId: 3,
        name: "فحص رافعة 2",
        testEntries: [
            {
                testName: 'فحص رافعة 2', testCheckName: 'تشك 1'
            },
            {
                testName: 'فحص رافعة 2', testCheckName: 'تشك 2'
            },
            {
                testName: 'فحص رافعة 2', testCheckName: 'تشك 3'
            },
            {
                testName: 'فحص رافعة 2', testCheckName: 'تشك 4'
            }
        ]
    }
]

export const tests = [
    {
        id: 1,
        instrumentId: 3,
    }
]

