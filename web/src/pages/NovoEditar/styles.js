import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(0, 0, 0, 0.3);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    textarea {
      background: rgba(0, 0, 0, 0.3);
      border: 0;
      border-radius: 4px;
      height: 88px;
      padding: 10px 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    span {
      color: #ffd700;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    > button {
      display: flex;
      align-items: center;
      justify-content: space-around;
      align-self: flex-end;

      border: 0;
      background: #f94d6a;
      border-radius: 4px;

      padding: 10px;
      margin: 5px 0 0;
      height: 36px;

      transition: background 0.2s;

      span {
        font-weight: bold;
        color: #fff;
        font-size: 14px;
        margin: 0 10px;
        align-self: center;
      }

      &:hover {
        background: ${darken(0.03, '#F94D6A')};
      }
    }
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    display: block;
    width: 100%;
  }
`;

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
