import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { frameHtml } = req.body;

    if (!frameHtml) {
      return res.status(400).json({ message: 'Frame HTML is required' });
    }

    // Define the folder path using the relative path '../../../Frames'
    const folderPath = path.join(process.cwd(), '../../../Frames');
    
    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Create a unique file name
    const fileName = `frame-${Date.now()}.html`;
    const filePath = path.join(folderPath, fileName);

    // Write the frame HTML to the file
    fs.writeFileSync(filePath, frameHtml, 'utf8');

    res.status(200).json({ message: 'Frame saved successfully', fileName });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
