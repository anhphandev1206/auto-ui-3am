module.exports = Object.freeze({
  LOGIC: {
    BEFORE: '1',
    MAIN: '2',
    AFTER: '3'
  },
  BLOCK: {
    NORMAL: 1,
    FOR: 2,
    WHILE: 3,
    IF: 4,
    ELSE: 5,
  },
  TYPE_KEY_PRESS: {
    SINGLE: 1,
    COMBO: 2,
    TEXT: 3
  },
  ACTION_TYPE: {
    WAIT_ELEMENT: 1,
    GET_ELEMENT_ATTRIBUTE: 2,
    GET_ELEMENT_TEXT: 3,
    COUNT_ELEMENT: 4,
    MOUSE_CLICK: 5,
    MOUSE_TRY_TO_CLICK: 6,
    MOUSE_MOVE: 7,
    MOUSE_PRESS_AND_HOLD: 8,
    MOUSE_RELEASE: 9,
    MOUSE_SCROLL: 10,
    KEY_PRESS: 11,
    FILE_UPLOAD: 12,
    SELECT_DROPDOWN: 13,
    HTTP_REQUEST: 14
  }
});
