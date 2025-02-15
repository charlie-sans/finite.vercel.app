const documentationFiles = [
    {
        name: 'Getting Started',
        type: 'file',
        path: '/README.md',
        notes: 'Any file you open that has a note or set of notes will display here.'
    },
    {
        name: 'Masm Documentation',
        type: 'folder',
        children: [
            {
                name: 'V1 Instructions',
                type: 'file',
                path: 'spec/v1instructions.md',
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
                        notes: 'This is a note for the Spec file.'
                    },
                    {
                        name: 'Micro Assembly basics',
                        type: 'file',
                        path: 'spec/MASMBasics.md',
                        notes: 'This is a note for the Micro Assembly basics file.'
                 
                    },
                    {
                        name: 'Includes',
                        type: 'file',
                        path: 'spec/includes.md',
                        notes: 'This is a note for the Includes file.'
                    },
                    {
                        name: 'memory layout',
                        type: 'file',
                        path: 'spec/memory.md',
                        notes: 'This is a note for the memory layout file.'
                    },
                    {
                        name: 'the bare minimum',
                        type: 'file',
                        path: 'spec/min.md',
                        notes: 'This is a note for the the bare minimum file.'
                    }
                ]
            }
        ]
    }
]

export default documentationFiles;