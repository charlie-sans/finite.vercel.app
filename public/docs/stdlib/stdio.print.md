# stdio.print


NOTE: due to internal changes in micro assembly, this file is called stdio.print instead of stdio.io.
appoligies for the inconvience.
importing stdio.print includes ( 3 ) functions you can use inside your code.

```wasm
lbl printf
    ;; set the FD for (stdout = 1, stderr = 2) in RAX,
     set number for memory address in RBX for string start
```

```wasm
lbl printchar
;; set the FD for (stdout = 1, stderr = 2) in RAX, 
set number as ascii in RBX
```

```wasm
lbl printint
    ;; set the FD for (stdout = 1, stderr = 2) in RAX,
    set the number to print in RBX
```


here's a demo for how to use the functions in here.
```wasm
#include "stdio.print"
lbl main
    mov RAX 1
    ;; the number to print
    mov RBX 50
    call #printint
    db 100 "Hello, world!\n"
    mov RBX 100
    call #printf
    mov RBX 72
    call #printchar
    hlt
```
