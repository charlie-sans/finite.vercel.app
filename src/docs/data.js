const documentationFiles = [
    {
        name: 'Getting Started',
        type: 'file',
        path: 'README.md',
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
                notes_path: 'spec/v1instructions_notes.md'
            },
            {
                name: 'Spec',
                type: 'folder',
                children: [
                    {
                        name: 'Spec',
                        type: 'file',
                        path: 'spec/spec.md',
                        notes_path: 'spec/spec_notes.md'
                    },
                    {
                        name: 'Micro Assembly basics',
                        type: 'file',
                        path: 'spec/MASMBasics.md',
                        notes_path: 'spec/MASMBasics_notes.md'
                    },
                    {
                        name: 'Includes',
                        type: 'file',
                        path: 'spec/includes.md',
                        notes_path: 'spec/includes_notes.md'
                    },
                    {
                        name: 'memory layout',
                        type: 'file',
                        path: 'spec/memory.md',
                        notes_path: 'spec/memory_notes.md'
                    },
                    {
                        name: 'the bare minimum',
                        type: 'file',
                        path: 'spec/min.md',
                        notes_path: 'spec/min_notes.md'
                    }
                ]
            }
        ]
    }
]

export default documentationFiles;