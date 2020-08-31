import React from 'react';



class Test extends React.Component {
  constructor(props) {
    super(props);
    // this.x = this._get();
    this.state = {
      data: "",
    };
  }

  _get() {
    (async () => {
      try{
        const rawResponse = await fetch('http://127.0.0.1:5555/kraken/test');
        const content = await rawResponse.json();
        this.state.value=content.message;
        console.log(content);
      }catch(err){
        console.log(err)
      }

    })();

  }

  componentDidMount() {
    fetch('http://127.0.0.1:5555/kraken/balance')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }




  _renderObject(objects){
    return Object.entries(objects).map(([key, value], i) => {
      return (
        <div key={key}>
          {key} : {value}
        </div>
      )
    })
  }

  render(){

    var objects = this.state.data.result || [];

    // const keys = Object.keys(objects);
    // const value = Object.values(objects);


    return(

      <div>
        <div>
          <h1> Balance</h1>
        </div>
        {this._renderObject(objects)}
      </div>
    )
  }


}

export default Test;
