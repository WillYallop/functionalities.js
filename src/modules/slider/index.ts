interface Config {
    firstName: string;
    lastName: string; 
    age: number; 
}

export default class Slider {
    constructor(config?: Config) {
        // Defines a function type 
        // Any function set as this variable must match the bellow type
        var functionTest: (a: number, b: number, callback: (a: string) => void ) => number;
        functionTest = this.test;

        functionTest(10, 20, (iAmAString) => {
            console.log(iAmAString);
        });



    } 
    test(num: number, num2: number, callback) {
        callback('tst');
        return num + num2;
    }
    test2(num: number, num2: number) {
        return `${num} + ${num2}`;
    }
    test3(data: Car) {
        
    }
} 
