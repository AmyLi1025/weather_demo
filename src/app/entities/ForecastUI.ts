export interface ForecastUI {
    date: string,
    datetime: number,
    data: ForecastUIDetail[]
}

export interface ForecastUIDetail {
    temp: string,
    weather_main: string,
    weather_desc: string,
    humidity: number,
    pressure: number,
    wind_speed: number,
    datetime: number,
    image_url: string
}