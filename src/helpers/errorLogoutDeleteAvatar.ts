const fs = require('fs').promises;
import path from 'path';

//if an error occurs during registration, delete the profile picture.

export const deleteProfileImage = async (nameProfileImage: string) => {
    await fs.unlink(path.join(__dirname, `../Avatars/${nameProfileImage}`));
}