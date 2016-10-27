copy ..\..\www\js\controllers\%1.js .
tleaf %1.js %1_spec.js
del /Q/F %1.js