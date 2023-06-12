import {css} from '@microsoft/fast-element'

const styles = css`
.accordion {
    width: 100%;
    box-sizing: border-box;
}

.accordion-item {
    width: 100%;
    background-color: white;
    color: #333;
    margin: 1em 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.accordion-header {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    font-size: 1em;
    border: none;
    text-align: left;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    background-color: rgb(250, 250, 250);
}

.accordion-icon {
    color: grey;
    transition: transform 0.3s ease-in-out;
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.1s ease-out;  
    padding: 0 1em;
    box-sizing: border-box;
}

.accordion-item.active .accordion-content {
    max-height: 1000px;
    padding: 1em;
}

.accordion-item.active .accordion-icon {
    transform: rotate(180deg);
}
`

export default styles