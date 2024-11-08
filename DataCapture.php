<?php

namespace DataFoodConsortium\Connector;

class DataCapure implements IConnectorObserver {
    private string $destinationUrl;

    public function __construct(string $url = null) {
        $this->setDestinationUrl($url);
    }

    public function getDestinationUrl() {
        return $this->destinationUrl;
    }

    public function setDestinationUrl($url) {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $this->destinationUrl = $url;
        } else {
            $this->destinationUrl = null;
        }
    }

    public function update(\SplSubject $connector, string $event = null, $json = null): void {
        $urlIsValid = filter_var($this->destinationUrl, FILTER_VALIDATE_URL);
        if ($event === $connector->EVENT_EXPORT && $urlIsValid) {
            $ch = curl_init($this->destinationUrl);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            curl_close($ch);
        }
    }
}
