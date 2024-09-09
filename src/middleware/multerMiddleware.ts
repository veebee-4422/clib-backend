import fs from "fs";
import path from "path";
import multer from "multer";

function getDirectory(dirCat: string | null, dirPath: string[]) {
    switch (dirCat) {
        case "fonts":
            return path.join(__dirname, "..", "..", "temp", "fonts");
        case "images":
            return path.join(__dirname, "..", "..", "images");
        case "pdf":
            return path.join(__dirname, "..", "..", "pdf");
        default:
            const directory = path.join(__dirname, ...dirPath);
            !fs.existsSync(directory) && fs.mkdirSync(directory, { recursive: true });
            
            return directory;
    }
}

// dirPath needs to be sent everytime a file is uploaded. to save in temp directory send ../temp/folder
const uploadStorage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            if(typeof req.query.dirPath !== "string" || typeof req.query.dir !== "string") return;
            const directory = getDirectory(req.query.dir || null, req.query.dirPath?.split("/") || []);

            callback(null, directory);
        },
        filename: function (req, file, callback) {
            const fileName = file.originalname;

            callback(null, fileName);
        }
    })
});

export function uploadFile(fields = [], singleFieldName = "file"){
    if(!fields.length) return uploadStorage.single(singleFieldName);
    return uploadStorage.fields(fields);
}

export const parseMultipartFormData = uploadStorage.none();