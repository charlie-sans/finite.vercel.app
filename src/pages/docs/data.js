const documentationFiles = [
    {
        name: 'Getting Started',
        type: 'file',
        path: '/README.md',
        metadata: {
            author: 'Team Finite',
            lastUpdated: '2024-01-15',
            tags: ['introduction', 'setup', 'basics'],
            difficulty: 'Beginner'
            // readingTime will be calculated dynamically
        },
        notes: 'Any file you open that has a note or set of notes will display here.'
    },
    {
        name: 'Standard Libary',
        type: 'folder',
        children: [
            {
                name: 'stdio',
                type: 'folder',
                children: [
                    {
                        name: 'io',
                        type: 'file',
                        path: 'stdlib/stdio.print.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2025-2-15',
                            tags: ['stdio', 'print', 'library'],
                            difficulty: 'Intermediate'
                 

                        },
                        notes: 'under the catagory of IO, printing to the console can be handy.'
                    }
                ]
            },
        ]
    },      
    {
        name: 'Masm Documentation',
        type: 'folder',
        children: [
            {
                name: 'V1 Instructions',
                type: 'file',
                path: 'spec/v1instructions.md',
                metadata: {
                    author: 'Team Finite',
                    lastUpdated: '2024-01-10',
                    tags: ['instructions', 'reference', 'v1'],
                    difficulty: 'Intermediate',
                    // readingTime will be calculated dynamically
                    prerequisites: ['Getting Started']
                },
                notes: 'This is a note for the V1 Instructions file.'
            },
            {
                name: 'Spec',
                type: 'folder',
                children: [
                    {
                        name: 'Spec',
                        type: 'file',
                        path: 'spec/spec.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2024-01-12',
                            tags: ['specification', 'technical', 'reference'],
                            difficulty: 'Advanced',
                            // readingTime will be calculated dynamically
                            relatedDocs: ['V1 Instructions', 'memory layout']
                        },
                        notes: 'This is a note for the Spec file.'
                    },
                    {
                        name: 'Micro Assembly basics',
                        type: 'file',
                        path: 'spec/MASMBasics.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2024-01-11',
                            tags: ['assembly', 'basics', 'micro'],
                            difficulty: 'Beginner'
                            // readingTime will be calculated dynamically
                        },
                        notes: 'This is a note for the Micro Assembly basics file.'
                    },
                    {
                        name: 'Includes',
                        type: 'file',
                        path: 'spec/includes.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2024-01-13',
                            tags: ['includes', 'reference'],
                            difficulty: 'Intermediate'
                            // readingTime will be calculated dynamically
                        },
                        notes: 'This is a note for the Includes file.'
                    },
                    {
                        name: 'memory layout',
                        type: 'file',
                        path: 'spec/memory.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2024-01-09',
                            tags: ['memory', 'layout', 'reference'],
                            difficulty: 'Advanced'
                            // readingTime will be calculated dynamically
                        },
                        notes: 'This is a note for the memory layout file.'
                    },
                    {
                        name: 'the bare minimum',
                        type: 'file',
                        path: 'spec/min.md',
                        metadata: {
                            author: 'Team Finite',
                            lastUpdated: '2024-01-08',
                            tags: ['minimum', 'reference'],
                            difficulty: 'Beginner'
                            // readingTime will be calculated dynamically
                        },
                        notes: 'This is a note for the the bare minimum file.'
                    }
                ]
            }
        ]
    },
    {
        name: 'Tutorials',
        type: 'folder',
        children: [
            {
                name: 'Hello World',
                type: 'file',
                path: 'tutorials/hello-world.md',
                metadata: {
                    author: 'Team Finite',
                    lastUpdated: '2024-01-14',
                    tags: ['tutorial', 'beginner', 'example'],
                    difficulty: 'Beginner',
                    // readingTime will be calculated dynamically
                    prerequisites: ['Getting Started']
                },
                notes: 'Step-by-step guide for writing your first program.'
            }
        ]
    }
]

export default documentationFiles;