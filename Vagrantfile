# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

$script = <<SCRIPT
# DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -yqq mc;

##
# Postgresql
##
#echo Installing Postgresql...

#apt-get install -yqq mysql;


echo Installing PHP...

apt-get install -yqq php5-cli php5-fpm php5-curl php5-pgsql php5-sqlite php5-mysql php5-mcrypt libapache2-mod-php5 apache2

a2enmod rewrite
service apache2 restart
SCRIPT


Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
	config.vm.box = "debian/wheezy64"

	# Create a forwarded port mapping which allows access to a specific port
	# within the machine from a port on the host machine. In the example below,
	# accessing "localhost:8080" will access port 80 on the guest machine.
	#config.vm.network :forwarded_port, guest: 8000, host: 8000

	# Create a private network, which allows host-only access to the machine
	# using a specific IP.
	config.vm.network :private_network, ip: "192.168.24.15"
	config.vm.hostname = "ecopromhtml.dev"

	# speedup filesystem
	config.vm.synced_folder "./", "/var/www", :mount_options => ['nolock,vers=3,udp,noatime,actimeo=1'], :export_options => ['async,insecure,no_subtree_check,no_acl,no_root_squash'], :nfs => true

	config.vm.provider :virtualbox do |vb|
		vb.customize ["modifyvm", :id, "--memory", "1024"]
		vb.customize ["modifyvm", :id, "--cpus", "1"]
		vb.customize ["modifyvm", :id, "--hwvirtex", "on"]
		vb.customize ["modifyvm", :id, "--nestedpaging", "on"]
	end

	config.vm.provision :shell, inline: $script
end