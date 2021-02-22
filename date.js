exports.getDate = function(){
    const today = new Date();
    return today.toLocaleDateString("en-US",{ weekday: 'long', month: 'long', day: 'numeric'});
};

exports.getDay = function(){
    const today = new Date();
    return today.toLocaleDateString("en-US",{ weekday: 'long'});
};