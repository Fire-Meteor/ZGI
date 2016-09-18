# Define the base image
# node:argon is the LTS of node docker image
FROM node:argon

# Set the working folder as the one that Jenkins will pull the updated codes
WORKDIR /var/lib/jenkins/jobs/ZGI_master/workspace

# Install app dependencies
COPY package.json /var/lib/jenkins/jobs/ZGI_master/workspace/
RUN apt-get install build-essential
RUN npm install

# Bundle app to docker image
COPY . /var/lib/jenkins/jobs/ZGI_master/workspace

# Start the web port
EXPOSE 3000

# Run the web app
CMD ["npm", "keystone.js"]
