import * as React from 'react';
import { PrimaryButton, DefaultButton, Stack } from '@fluentui/react';

export interface MainContainerProps {
  width: number;
  height: number;
  onLoadData: () => void;
  onClearData: () => void;
  inputData: Record<string, any>;
}

export class MainContainer extends React.Component<MainContainerProps> {
  public render(): React.ReactNode {
    const { width, height, onLoadData, onClearData, inputData } = this.props;



    return (
      <>
        <Stack tokens={{ childrenGap: 5 }} styles={{ root: { height } }}>
          <Stack.Item grow={false}>
            <PrimaryButton
              text="Load Data"
              style={{ width, height: 30 }}
              onClick={() => onLoadData()}
            />
            <DefaultButton
              text="Clear Data"
              style={{ width, height: 30 }}
              onClick={() => onClearData()}
            />
          </Stack.Item>
          <Stack.Item styles={{ root: { padding: 5 } }}>
            {this.renderObject(inputData)}
          </Stack.Item>
        </Stack>

      </>
    )
  }

  private renderObject(obj: Record<string, any>, dept = 0): React.ReactNode[] {
    const elements: React.ReactNode[] = [];
    const elementStyle: React.CSSProperties = { paddingLeft: dept, textAlign: 'left' };
    if (obj) {
      Object.keys(obj).map((key, index) => {
        if (obj[key] && typeof obj[key] === 'object') {
          elements.push(<div key={index} style={elementStyle}>{`${key}>`}</div>);
          elements.push(this.renderObject(obj[key], dept + 5));
        } else {
          elements.push(<div key={index} style={elementStyle}>{`${key}: ${obj[key]}`}</div>);
        }
      });
    }

    return elements;
  }
}
