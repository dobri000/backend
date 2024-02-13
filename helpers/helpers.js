const fs = require('fs');
const crypto = require('crypto');

const generateImageHash = () => {
  const randomBytes = crypto.randomBytes(16);
  const hash = crypto.createHash('sha1');
  hash.update(randomBytes);
  const imageHash = hash.digest('hex');
  return imageHash;
};


const saveImage = (base64String, filePath) => {
    console.log(base64String);
    const dataBuffer = Buffer.from(base64String, 'base64');
    fs.writeFileSync(filePath, dataBuffer);
};

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Greška prilikom brisanja slike:', err);
      return;
    }
    console.log('Slika uspešno obrisana.');
  });
}

module.exports =  {
    saveImage,
    generateImageHash,
    deleteImage
}

