export class DataElement{
    constructor(props){
        this.code = props.code;
        this.name = props.name;
        this.content = new Map();
    }
    
    getName(){
        return this.name;
    }

}