function Card(number) {
  let value;
  let suit;
  
  switch (Math.floor((number-1)/13)) {

    case 0:

      value = number;
      suit= 'C';
      break;

    case 1:

      value = number-13;
      suit= 'D';
      break;

    case 2:
      value = number-26;
      suit = 'H';
      break;

    case 3:

      value =number-39;
      suit = 'S';
      break;

    default:

      value = number;

  }

  return { card:number, value,  suit };
  
}

module.exports = Card;