var numberInputDefinitions =
{
    Amount:
    {
        Patterns:
        {
            Input:
            [
                '#,##0.##',
                '0.##'
            ],
            Output: '#,##0.00'
        },
        Range:
        {
            Min: -Infinity,
            Max: Infinity
        }
    },
    Percentage:
    {
        Patterns:
        {
            Input:
            [
                '0.##'
            ],
            Output: '0.00'
        },
        Range:
        {
            Min: 0,
            Max: 999.99
        }
    }
};

function numberInfo(
    numberInputDefinition
    )
{
    var parsers = numberInputDefinition.Patterns.Input.map(
        function(
            pattern
            )
        {
            return parseNumber(pattern);
        });

    var outputPattern = parseNumberFormatPattern(numberInputDefinition.Patterns.Output);
    var multiplier = Math.pow(10, outputPattern.positive.maximumFractionDigits);

    this.format = formatNumber(outputPattern);

    this.parse = function(
        text
        )

    {
        var number = null;
        var index = 0;
        while(index < parsers.length && isNaN(number = parsers[index++](text)));

        if(isNaN(number))
            return number;

        if(number < numberInputDefinition.Range.Min ||
           number > numberInputDefinition.Range.Max)
            return NaN;

        return number;
    };

    this.round = function(
        number
        )
    {
        return Math.round(number * multiplier) / multiplier;
    };
}

var NumberInput =
{
    validationErrorCssclass : 'number-validation-error',

    initialise: function(
        numberInfo,
        numberInput
        )
    {
        numberInput.set = function(
            amount
            )
        {
            with(this)
            {
                value = numberInfo.format(amount);
                $(this).removeClass(NumberInput.validationErrorCssClass);
            }
        };

        numberInput.get = function()
        {
            return numberInfo.parse(numberInput.value);
        };

        numberInput.validate = function()
        {
            with(this)
            {
                if(value == '')
                    $(this).removeClass(NumberInput.validationErrorCssClass);

                else
                {
                    var number = numberInfo.parse(value);
                
                    if(isNaN(number))
                        $(this).addClass(NumberInput.validationErrorCssClass);

                    else
                        set(number);
                }
            }
        }

        numberInput.onchange = numberInput.onchange ?
            numberInput.validate.chain(numberInput.onchange) : numberInput.validate;

        numberInput.validate();
    }
}

for(var definitionName in numberInputDefinitions)
    this[definitionName] = new numberInfo(numberInputDefinitions[definitionName]);
