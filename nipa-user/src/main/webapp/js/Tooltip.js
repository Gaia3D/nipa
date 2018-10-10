var Tooltip = function (element)
{
    this._element;
    this._title;

    var div = document.createElement('div');
    div.className = 'tooltip';

    var title = document.createElement('span');
    title.className = 'title';
    div.appendChild(title);

    this._element = div;
    this._title = title;

    element.appendChild(div);

    this.hide();
}
Tooltip.prototype.show = function ()
{
    this._element.style.display = 'block';
}
Tooltip.prototype.hide  = function ()
{
    this._element.style.display = 'none';
}
Tooltip.prototype.showAt  = function (position, message)
{
    if(position && message) {
        this.show();
        this._title.innerHTML = message;
        this._element.style.left = position.x + 10 + "px";
        this._element.style.top = (position.y - this._element.clientHeight / 2) + "px";
    }
}