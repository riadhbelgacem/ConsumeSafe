#!/bin/bash
# Configure passwordless sudo for Jenkins user for specific commands

# Create sudoers file for jenkins user
echo "Creating sudoers configuration for Jenkins..."

sudo tee /etc/sudoers.d/jenkins-ansible > /dev/null << 'EOF'
# Allow jenkins user to run Ansible-related commands without password
jenkins ALL=(ALL) NOPASSWD: /usr/bin/snap
jenkins ALL=(ALL) NOPASSWD: /usr/bin/apt-key
jenkins ALL=(ALL) NOPASSWD: /usr/bin/apt-get
jenkins ALL=(ALL) NOPASSWD: /usr/bin/tee
jenkins ALL=(ALL) NOPASSWD: /usr/bin/kubectl
jenkins ALL=(ALL) NOPASSWD: /usr/local/bin/helm
EOF

# Set correct permissions
sudo chmod 0440 /etc/sudoers.d/jenkins-ansible

echo "Jenkins sudo configuration complete!"
echo "Jenkins can now run Ansible tasks that require sudo without password."
