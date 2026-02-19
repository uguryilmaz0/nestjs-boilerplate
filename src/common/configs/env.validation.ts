import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from '../enums/environment.enum';

class EnvironmentVariables {
    @IsEnum(Environment, {
        message: 'Hata: NODE_ENV sadece şu değerleri alabilir / Error: NODE_ENV can only get these values : development, production, test, staging',
    }) NODE_ENV: Environment;

    @IsNumber()
    PORT: number = 3000; // Varsayılan port / Default port

    @IsString() DATABASE_URL: string;
}

export function validateEnv(config: Record<string, any>) {
    // 1. process.env'den gelen objeyi bizim sınıfımıza dönüştür / Convert the object from process.env to our class
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true, // Tür dönüşümünü etkinleştir / Enable type conversion
    });

    // 2. Senkron olarak doğrula / Validate synchronously
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false, // Eksik özellikleri atlama / Do not skip missing properties
    })

    // 3. Hata varsa, hataları topla ve bir hata fırlat / If there are errors, collect them and throw an error
    if (errors.length > 0) {
        const errorMessages = errors.map((err) => {
            // Eğer constraints yoksa alt hatalara bak (recursive) yoksa 'Unknown error' dön
            return err.constraints
                ? Object.values(err.constraints).join(', ')
                : `Validation failed for property ${err.property} / Validasyon ${err.property} için başarısız oldu`;
        });

        throw new Error(`❌ Config Validation Error:\n${errorMessages.join('\n')} / Config doğrulama hatası:\n${errorMessages.join('\n')}`);
    }

    return validatedConfig;
}