import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  private readonly templatesDir = __dirname; // dist/notifications/templates

  render(templateName: string, data: Record<string, any>): string {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template not found: ${templateName}. Path: ${filePath}`);
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const compile = Handlebars.compile(source);

    return compile(data);
  }
}
