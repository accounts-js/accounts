# Design

The js-accounts organization was setup with the mission of writing a complete and modular accounts system.

## Packages structure
In order to reach those goals, we split the accounts suite into abstraction layers and a number of packages 
that each can implement at most one layer. 

Those layers exports contracts in the form of Flow interfaces.
Communication between the layers is done only using those interfaces.
 
![alt text](res/packages.jpg "Package structure")

