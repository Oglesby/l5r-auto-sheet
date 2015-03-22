# Install git
sudo yum install -y git

# Add the repo for installing NPM
sudo rpm -i http://download-i2.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install NPM
sudo yum install -y npm

# Update NPM
sudo npm update -g npm

# Install gulp and bower via NPM
sudo npm install -g gulp bower

# Open port 9000 on the VM
sudo iptables -I INPUT 1 -p tcp --dport 9000 -j ACCEPT
sudo service iptables save