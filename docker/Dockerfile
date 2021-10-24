FROM node:16

RUN apt-get update \   
 && apt-get install libpam0g-dev iptables tcpdump -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* \
 && mkdir /etc/iptables \
 && useradd -m iptables \
 && echo "iptables:iptables" | chpasswd
