#! bin/bash

artillery run ./artillery/user-flow-test.yml --record --key $ARTILLERY_CLOUD_API_KEY
