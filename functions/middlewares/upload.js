import Busboy from 'busboy';

const upload = {
  single: (fieldname) => (req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      return next();
    }

    const busboy = Busboy({ headers: req.headers });
    req.body = req.body || {};
    req.file = null;

    busboy.on('field', (name, val) => {
      if (req.body[name] === undefined) {
        req.body[name] = val;
      } else if (Array.isArray(req.body[name])) {
        req.body[name].push(val);
      } else {
        req.body[name] = [req.body[name], val];
      }
    });

    busboy.on('file', (name, stream, info) => {
      if (name !== fieldname) {
        stream.resume();
        return;
      }

      const { filename, mimeType } = info;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!allowedTypes.includes(mimeType) && !mimeType.startsWith('image/')) {
        stream.resume();
        return next(new Error('Solo se permiten archivos de imagen'));
      }

      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        req.file = {
          fieldname: name,
          originalname: filename,
          mimetype: mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    busboy.on('finish', () => next());
    busboy.on('error', (err) => next(err));

    // Cloud Run (gen2): rawBody puede estar disponible o no según el tamaño
    // Leemos el stream manualmente para cubrir ambos casos
    if (req.rawBody instanceof Buffer && req.rawBody.length > 0) {
      busboy.end(req.rawBody);
    } else {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => busboy.end(Buffer.concat(chunks)));
      req.on('error', (err) => next(err));
    }
  },
};

export default upload;