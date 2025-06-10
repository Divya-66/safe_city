import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_CONFIG } from '../config/aws-config';

// Debug logging
console.log('AWS Config:', {
  region: AWS_CONFIG.region,
  bucketName: import.meta.env.VITE_AWS_S3_BUCKET,
  hasAccessKey: !!AWS_CONFIG.accessKeyId,
  hasSecretKey: !!AWS_CONFIG.secretAccessKey
});

const s3Client = new S3Client({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
  }
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET;

// Upload image to S3
export const uploadImage = async (file) => {
  try {
    console.log('Starting upload for file:', file.name, 'Type:', file.type, 'Size:', file.size);
    const key = `incidents/${Date.now()}-${file.name}`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log('File converted to Uint8Array, size:', uint8Array.length);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: uint8Array,
      ContentType: file.type
    });

    console.log('Sending command to S3...');
    await s3Client.send(command);
    console.log('Upload successful!');
    
    return `https://${BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Detailed error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Get signed URL for private images
export const getImageUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw new Error('Failed to get image URL');
  }
};

// Delete image from S3
export const deleteImage = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}; 