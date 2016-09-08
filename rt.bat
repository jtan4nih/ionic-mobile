@echo off
echo "************************************************************************"
echo "Make sure the Ionic and mock service HOSTs are shut down!"
echo "You should hit Ctrl + C to quit and restart the tests again."
echo "************************************************************************"
pause
@echo on

:nodist use stable
cd tests && r && cd ..