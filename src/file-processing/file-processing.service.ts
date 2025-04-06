import {
  Injectable,
  Logger,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdf from 'pdf-parse';

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);

  async parseDocument(file): Promise<string> {
    try {
      switch (file.mimetype) {
        case 'application/pdf':
          const pdfData = await pdf(file.buffer);
          return pdfData.text;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const { value } = await mammoth.extractRawText({
            buffer: file.buffer,
          });
          return value;

        default:
          throw new UnsupportedMediaTypeException(
            'Unsupported file type. Only PDF and DOCX are supported.',
          );
      }
    } catch (error) {
      this.logger.error(`File parsing error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
