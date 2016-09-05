Pocket Ikoma
============================
Is an Ikoma! In your pocket!

Developing With Vagrant
-----------------------
A vagrant file is included for quickly setting up a development environment: http://vagrantup.com/ .

    > git clone https://github.com/Oglesby/pocket-ikoma.git
    > cd pocket-ikoma/vagrant
    > vagrant up

This will create a VM with all of the necessary dependencies (NPM, bower, etc) for development and a shared folder at
`/source` pointing to your checked out code. You may ssh into this VM by typing `vagrant ssh` or by connecting with your
own client to `localhost:2222` .

After ssh'ing into the VM

    > cd /source
    > npm install --no-bin-links
    > bower install
    > gulp

will download the project's dependencies, build it, and begin serving the app on port 9000. If the npm command complains
about `Maximum call stack size exceeded`, just run it again. The app can be accessed by navigating to
`http://localhost:9000` on the host machine.