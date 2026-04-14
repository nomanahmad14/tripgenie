export const getTransportOptions = (distance) => {
  let recommended = [];
  let allOptions = ["road", "train", "flight"];

  if (distance < 300) {
    recommended = ["road"];
  } else if (distance < 800) {
    recommended = ["road", "train"];
  } else if (distance < 1500) {
    recommended = ["train", "flight"];
  } else {
    recommended = ["flight"];
  }

  return {
    recommended,
    allOptions
  };
};