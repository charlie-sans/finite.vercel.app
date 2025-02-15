# including files 

inside MicroAssembly, you can include other files using the `include` directive. 

```assembly
#include "file.masm"
```

if you want to include a file from the standard library, you can use the `std` prefix. 

```assembly
#include :std.io.file: ; this will include the file.masm file from the io directory
```



local includes are relative to the file that includes them. 

```assembly
#include "file.masm" ; this will include the file.masm file from the same directory as the file that includes it
```
