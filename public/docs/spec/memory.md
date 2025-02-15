# Memory

inside Micro Assembly, memory is on avarage a 32kib range (32768) of fixed width memory. This memory is used for things such as the `push` or `pop` instructions, as well as the `load` and `store` instructions. The memory is also used for the stack, which is used for storing temporary values.

The memory is also used for the `call` and `ret` instructions, which are used for calling and returning from functions.

the stack is located around 1024 bytes from the end of the memory, and grows downwards. This means that the stack pointer is initialized to 32768 - 1024 = 31744.


now, please note that if the user want's the memory of their program to be larger for some reason, say for larger string storing then they can change it through the instruction `setmem` which takes a single argument, the new size of the memory. This instruction must be the first instruction in the program, and the new size must be a multiple of 1024.





one such example of a program that uses the memory is the following:

```asm
LBL main
    setmem 4096 ;; sets memory to 4096 bytes instead of 32768, we don't need that much memory
    DB $50 "Hello world!" ;; stores the string "Hello world!" in memory starting at address 50
    OUT 1 $50 ;; outputs the string "Hello world!" to the screen
    HLT
```

this program sets the memory to 4096 bytes, stores the string "Hello world!" in memory starting at address 50, and then outputs the string to the screen. The program then halts.halts
