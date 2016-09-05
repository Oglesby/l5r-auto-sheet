# Install git
sudo yum install -y -q git

# Install NPM
sudo yum install -y -q epel-release
sudo yum install -y -q npm

# Update NPM
sudo npm update -g npm

# Update Node
sudo npm install -g n
sudo n stable

# Install gulp and bower via NPM
sudo npm install -g gulp bower

# Open ports 9000 and 35729 on the VM
sudo firewall-cmd --permanent --add-port=9000/tcp
sudo firewall-cmd --permanent --add-port=35729/tcp
sudo firewall-cmd --reload