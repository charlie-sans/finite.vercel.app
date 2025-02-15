# the bare minimum for MicroAssembly

yes, i know. this file name conflicts with the last one.

This is the real bare minimum for MicroAssembly to work.


## The bare minimum

in order for MicroAssembly to work, you need to have the following features:

- Mov, add, sub, mul, div.
- labels
- call
- hlt
- printf
- scanf
- memory movenemt using $<register> or $<number>


## The bare minimum example

```masm
#INCLUDE "stdlib.io.masm"
LBL main
    MOV RAX 5 ;; set rax to 5
    MOV RBX 5 ; set rbx to 5
    ADD RAX RBX ;; add rax and rbx and put output in rax (DEST += SRC)
    CALL #printf RAX ;; call pushes RIP to store it and then when it's done, pops back rip to go back to the instruction after this
    HLT ;; allways make sure you have this in your program, CMASM and the others might not respect your non halted code.
    ```

