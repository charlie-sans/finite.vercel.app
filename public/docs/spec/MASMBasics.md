# Micro Assembly basics

Inside Micro Assembly are the Instructions that power the language.

Things like Moving values around or writing strings to memory(resizable memory too!) and math functions like adding numbers and multiplying them.

Within the Instructions list, lets say we use mov/MOV:

the Move instruction wants a set of arguments in this order
- <Dest> <Src> 
where dest is the output of whatever your wanting to put the value from source.

Do note that even though the move instruction is listed here, all instructions inside MicroAssembly Take the <Dest> <Src> treatment, though you can choose to run it reverse at least inside JMASM
by passing --inrv(instruction reverse)

i'd highly recommend checking out JMASM on the homepage.


lets take for example, a simple program that adds 5 to 5 and prints the output

```masm
LBL main
    MOV RAX 5 ;; set rax to 5
    MOV RBX 5 ; set rbx to 5
    ADD RAX RBX ;; add rax and rbx and put output in rax (DEST += SRC)
    CALL #printf RAX ;; call pushes RIP to store it and then when it's done, pops back rip to go back to the instruction after this
    HLT ;; allways make sure you have this in your program, CMASM and the others might not respect your non halted code.
```


as you can see, the IO goes <Dest> <src> instead of <Src>, <Dest>.

even though MicroAssembly has some weird syntax rules, it stands out for the features such as being able to define functions inside ether C or the interperter via reflection or src code and being able to call them from within the MicroASM code.


















