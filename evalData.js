//grades and statistics are generated here

function getAllGrades(className, pupilName)
{
	var data = {oral: [], small: [], big: []};
	var oral = theData[className].oral;
	for(var i = 0; i < oral.length; i++)
		if(oral[i].name == pupilName)
			data.oral.push(oral[i]);
	var small = theData[className].small;
	for(var i = 0; i < small.length; i++)
		for(var j = 0; j < small[i].groups.length; j++)
			for(var k = 0; k < small[i].groups[j].pupils.length; k++)
				if(small[i].groups[j].pupils[k].name == pupilName)
				{
					data.small.push(small[i].groups[j].pupils[k]);
					data.small[data.small.length - 1].factor = small[i].factor;
				}
	var big = theData[className].big;
	for(var i = 0; i < big.length; i++)
		for(var j = 0; j < big[i].groups.length; j++)
			for(var k = 0; k < big[i].groups[j].pupils.length; k++)
				if(big[i].groups[j].pupils[k].name == pupilName)
				{
					data.big.push(big[i].groups[j].pupils[k]);
					data.big[data.big.length - 1].factor = big[i].factor;
				}
	return data;
}
