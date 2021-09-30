export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'potato',
    expiresIn: '1d'
  }
};
