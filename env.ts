export const ENV = {
    MODE: 'dev',
}

export const ENDPOINT_MAPPING = {
    DEV: 'http://localhost:4321',
    PROD: 'https://booleanstack.com',
    STAGING: 'https://staging--booleanstack.com',
}

export const GET_ENDPOINT = (ENV: keyof typeof ENDPOINT_MAPPING) => ENDPOINT_MAPPING[ENV]