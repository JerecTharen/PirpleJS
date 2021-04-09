#create folder that is in .gitignore
mkdir ".DATA"
#create data file that some endpoints are dependent on
echo "{
    \"name\" : \"this is a name\",
    \"value\" : 3.14
}" > "./.DATA/test.json"
echo "Created test json"
#create folder that some endpoints will put data in
mkdir ".DATA/MemeQuotes"





#create folder for ssl cert stuff
mkdir ".HTTPS"

#actually make ssl certs
cd ".HTTPS"
echo "In .HTTPS, creating ssl: "

country=US
state=#put state here
locality=#put city here
commonName=#put last name here
email=#put email here

echo "Using subj: "
echo "/C=$country/ST=$state/L=$locality/CN=$commonName/emailAddress=$email"

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -subj "//C=$country/ST=$state/L=$locality/CN=$commonName/emailAddress=$email"
echo "Done creating SSL cert"
cd ..
